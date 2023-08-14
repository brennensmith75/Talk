'use client'

import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardHeader, CardTitle } from '../../../components/ui/card'
import { Database } from '../../../lib/db_types'
import { postData } from '../../../lib/helpers'
import { getStripe } from '../../../lib/stripe-client'
import { format } from 'date-fns'
import { cn } from '../../../lib/utils'

type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']
interface ProductWithPrices extends Product {
  prices: Price[]
}
interface PriceWithProduct extends Price {
  products: Product | null
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null
}

interface Props {
  session: Session
  product: ProductWithPrices
  subscription: SubscriptionWithProduct | null
}

type BillingInterval = 'year' | 'month'

const ProductDetail = ({ product, session, subscription }: Props) => {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month')
  const [priceIdLoading, setPriceIdLoading] = useState<string>()

  const router = useRouter()
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: '/api/create-portal-link'
      })
      router.push(url)
    } catch (error) {
      if (error) return alert((error as Error).message)
    }
  }

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      return alert((error as Error)?.message)
    } finally {
      setPriceIdLoading(undefined)
    }
  }

  const price = product.prices[0]

  const formattedPrice = useMemo(() => {
    const priceString =
      price.unit_amount &&
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency!,
        minimumFractionDigits: 0
      }).format(price.unit_amount / 100)

    const priceInterval = price.interval === 'month' ? 'mo' : 'yr'

    return `${priceString}/${priceInterval}`
  }, [product.prices])

  const isSubscribed = useCallback(
    (priceId: string) => {
      return subscription?.price_id === priceId
    },
    [subscription]
  )

  console.log(subscription)

  const cancelAtPeriodEnd = subscription?.cancel_at_period_end

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <div className="flex flex-1 flex-col space-y-2.5">
          <CardTitle className="flex flex-1 justify-between">
            {product.name}
          </CardTitle>
          <div className="space-y-2 text-sm">
            <div className="text-gray-400">{formattedPrice}</div>
            <p>
              The Plus plan gives you access to unlimited chats and personas.
            </p>
            {isSubscribed(price.id) && cancelAtPeriodEnd && (
              <p className={cn('text-xs', 'text-red-500')}>
                Active until{' '}
                {format(
                  new Date(subscription.current_period_end),
                  'MMMM d, yyyy'
                )}
              </p>
            )}
            {isSubscribed(price.id) && (
              <Button
                variant={'link'}
                className="px-0"
                onClick={redirectToCustomerPortal}
              >
                Manage Subscription
              </Button>
            )}
          </div>
        </div>

        <div className="space-x-2">
          {!isSubscribed(price.id) && (
            <Button
              variant={'default'}
              type="button"
              disabled={false}
              loading={priceIdLoading === price.id}
              onClick={() => handleCheckout(price)}
            >
              Subscribe
            </Button>
          )}
          <Button variant="outline" disabled={true}>
            Your current plan
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

export default ProductDetail
