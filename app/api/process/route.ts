import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const cookieStore = cookies()
      const userId = (await auth({ cookieStore }))?.user.id

      if (!userId) {
        return new Response('Unauthorized', {
          status: 401
        })
      }

      const metaphorKey = process.env.METAPHOR_API_KEY || ''
      const id = req.nextUrl.searchParams.get('id')
      const res = await fetch(
        `https://api.metaphor.systems/contents?ids=${id}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-key': metaphorKey
          }
        }
      )
      const data = await res.json()
      const content = data.contents[0]
      return NextResponse.json(content)
    } catch (err) {
      console.error(`Failed to process content: ${err}`)
      return NextResponse.json({ content: undefined })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    })
  }
}

// METAPHOR API RETURN
// {
//   "contents": [
//     {
//       "url": "https://www.huffpost.com/entry/trump-lawyer-shortage-payment-refuses-to-listen-maggie-haberman_n_6302c273e4b0f7df9bb16e43",
//       "title": "Trump Having Hard Time Finding Lawyers Because They Want To Be Paid: Journalist",
//       "id": "WFQopXAOWnVGCyfpijcjyA",
//       "extract": "<div><section><section><p><a href=\"https://www.huffpost.com/news/topic/donald-trump\">Donald Trump</a> is reportedly having a difficult time finding lawyers to represent him in part because they want to be paid, New York Times political reporter <a href=\"https://www.huffpost.com/topic/maggie-haberman\">Maggie Haberman</a> sniped Sunday.</p><p>“You are seeing many fewer lawyers who are willing to go out and speak for him and/or hitch their wagon [to him] and maybe not get paid — which is a big thing,” Haberman told host Abby Phillip on <a href=\"https://www.huffpost.com/news/topic/cnn\">CNN</a>’s “Inside Politics.” </p><div><p>Trump has a reputation for <a href=\"https://www.usatoday.com/story/news/politics/elections/2016/06/09/donald-trump-unpaid-bills-republican-president-laswuits/85297274/\">ignoring or litigating bills</a> for various services.</p></div><p>He reportedly failed to pay <a href=\"https://www.huffpost.com/news/topic/rudy-giuliani\">Rudy Giuliani</a> despite his years of work on Trump’s behalf. </p><div><p>Giuliani associate Maria Ryan reportedly pleaded in a letter intended for Trump to pay him. She <a href=\"https://www.huffpost.com/entry/rudy-giuliani-associate-general-pardon-medal-trump-andrew-kirtzman-book_n_6301a6cce4b0e323a256327f\">submitted a bill for $2.5 million</a> to then-White House chief of staff Mark Meadows for Giuliani’s services, according to an upcoming book by journalist Andrew Kirtzman, “<a href=\"https://www.amazon.com/Giuliani-Rise-Tragic-Americas-Mayor/dp/1982153296\">Giuliani: The Rise and Tragic Fall of America’s Mayor</a>.” </p></div><p>The letter was intercepted by a Giuliani adviser before it reached Trump.</p><p>Lack of payment is not the only thing scaring off attorneys.</p><p>Lawyer <a href=\"https://www.huffpost.com/topic/alan-dershowitz\">Alan Dershowitz</a>, a champion of Trump who defended him in his first impeachment trial, told <a href=\"https://www.businessinsider.com/alan-dershowitz-reputable-lawyers-wont-go-anywhere-near-trump-2022-8\">Business Insider</a> that most reputable law firms are fearful that a relationship with Trump now will scare off other businesses. </p><p>“The firms won’t let them go near any case involving Trump. These are firms that want to continue to have clients, and they know that if they represent <a href=\"https://www.huffpost.com/news/topic/donald-trump\">Donald Trump</a>, they’ll lose a lot of clients,” he told Insider.</p><p>Haberman also said Trump is a difficult client.</p><p>“He doesn’t like to listen to his lawyers,” she explained. “The fact that it takes a huge effort to get him to do so by his lawyers always. This is an ongoing story we’ve been watching — frankly not just since he became president, but well before, going back to when he was advised by Roy Cohn many decades ago,” she added.</p><div><p></p></div><p>One attorney told Insider last week that Trump “<a href=\"https://www.businessinsider.com/alan-dershowitz-reputable-lawyers-wont-go-anywhere-near-trump-2022-8\">likes to run the show</a>, and as the old saying goes, if you represent yourself, you’ve got"
//     }
//   ]
// }
