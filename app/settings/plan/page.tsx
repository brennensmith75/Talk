import {
  getActiveProductsWithPrices,
  getSession,
  getSubscription,
  getUserDetails
} from '@/app/supabase-server'
import { redirect } from 'next/navigation'
import { Separator } from '../../../components/ui/separator'

import ProductDetail from './ProductDetail'

export default async function Account() {
  const [session, userDetails, products, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getActiveProductsWithPrices(),
    getSubscription()
  ])

  const user = session?.user

  if (!session) {
    return redirect('/signin')
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage billing settings, view invoices and pause your subscription.
        </p>
      </div>
      <Separator />
      {products.map(product => (
        <ProductDetail
          key={product.id}
          session={session}
          product={product}
          subscription={subscription}
        />
      ))}
    </div>
  )
}
