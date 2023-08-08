'use client'

import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card'
import { postData } from '../../../lib/helpers'

interface Props {
  plan: { name: string; price: number }
  session: Session
}

const ProductDetail = ({ plan, session }: Props) => {
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
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <div className="flex flex-1 flex-col space-y-2.5">
          <CardTitle className="flex flex-1 justify-between">
            {plan.name}
          </CardTitle>
          <CardDescription className="space-y-2">
            <div className="text-gray-400">${plan.price}/mo</div>
            <div>
              The Plus plan gives you access to unlimited chats and personas.
            </div>
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button variant={'default'} type="button">
            Subscribe
          </Button>
          <Button
            variant="outline"
            disabled={!session}
            onClick={redirectToCustomerPortal}
          >
            Manage
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

export default ProductDetail
