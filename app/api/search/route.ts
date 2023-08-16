import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const metaphorKey = process.env.METAPHOR_API_KEY || ''
    const json = await req.json()
    const res = await fetch('https://api.metaphor.systems/search', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': metaphorKey
      },
      body: JSON.stringify({
        query: json.query,
        useAutoprompt: true
      })
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(`Failed to get content: ${err}`)
    return NextResponse.json({ results: undefined })
  }
}

// METAPHOR API RETURN
// {
//   "results": [
//     {
//       "url": "https://commons.wikimedia.org/w/index.php?curid=63769676",
//       "title": "File:Donald Trump official portrait (cropped).jpg - Wikimedia Commons",
//       "publishedDate": "2022-11-08",
//       "author": "Q",
//       "score": 0.1213977113366127,
//       "id": "E9eVlUZsEGYR8XA6tQS7yQ"
//     },
//     {
//       "url": "https://www.theatlantic.com/ideas/archive/2020/08/trump-terrified-losing/614914/",
//       "title": "Trump Is Terrified of Losing",
//       "publishedDate": "2020-08-04",
//       "author": "Quinta Jurecic; Benjamin Wittes",
//       "score": 0.11482380330562592,
//       "id": "EHHxo4EI9dJhe-lYbSHDGA"
//     },
//     {
//       "url": "https://www.washingtonpost.com/politics/2022/08/16/trump-speeches-extreme-agenda-2024-bid/",
//       "title": "Six drastic plans Trump is already promising for a second term",
//       "publishedDate": "2022-08-16",
//       "author": "Isaac Arnsdorf",
//       "score": 0.11293046921491623,
//       "id": "Fvx2j3keWiIYbqVXMgUyFg"
//     },
//     {
//       "url": "https://twitter.com/realDonaldTrump/status/1297605856712970246",
//       "title": null,
//       "publishedDate": "2020-08-23",
//       "author": "realDonaldTrump",
//       "score": 0.11185941845178604,
//       "id": "SzJymoBcAhOnJ-jHmHOPOg"
//     },
//     {
//       "url": "https://www.newyorker.com/news/american-chronicles/donald-trump-and-the-sweepstakes-scammers",
//       "title": "Donald Trump and the Sweepstakes Scammers",
//       "publishedDate": "2022-08-16",
//       "author": "Condé Nast; Jeff Maysh",
//       "score": 0.11163351684808731,
//       "id": "5G8UCZ3WckBzKp7D-LuFFA"
//     },
//     {
//       "url": "https://edition.cnn.com/2022/11/15/politics/trump-2024-presidential-bid/index.html",
//       "title": "Former President Donald Trump announces a White House bid for 2024 | CNN Politics",
//       "publishedDate": "2022-11-15",
//       "author": "Gabby Orr; Kristen Holmes; Veronica Stracqualursi",
//       "score": 0.11114279180765152,
//       "id": "7tTU6HhPCJdfG6qYCJuw2w"
//     },
//     {
//       "url": "https://www.forbes.com/sites/danalexander/2022/12/22/yes-trump-is-still-a-billionaire-even-though-he-paid-so-little-in-taxes/",
//       "title": "Yes, Trump Is Still A Billionaire (Even Though He Paid So Little In Taxes)",
//       "publishedDate": "2022-12-22",
//       "author": "Dan Alexander",
//       "score": 0.1109677404165268,
//       "id": "cTG5bwPLqBVOr5pwTfRIWQ"
//     },
//     {
//       "url": "https://www.youtube.com/watch?v=RhL9iFkBaus&feature=youtu.be",
//       "title": "President Donald Trump Full Acceptance Speech at 2020 Republican National Convention",
//       "publishedDate": "2020-08-27",
//       "author": "C-SPAN",
//       "score": 0.11071810126304626,
//       "id": "yaPQTecQ73v8Hs6eZpXu2g"
//     },
//     {
//       "url": "https://www.theguardian.com/us-news/2022/aug/23/trump-classified-documents-records-mar-a-lago-fbi",
//       "title": "Trump stash retrieved from Mar-a-Lago runs to hundreds of classified files",
//       "publishedDate": "2022-08-23",
//       "author": "Hugo Lowell",
//       "score": 0.11037122458219528,
//       "id": "6GMETWv4VnrS7kGxg1AwHg"
//     },
//     {
//       "url": "https://www.theguardian.com/us-news/2023/apr/04/trump-indictment-pdf-full-text",
//       "title": "The charges against Donald Trump – full text of indictment",
//       "publishedDate": "2023-04-05",
//       "author": "Guardian staff reporter",
//       "score": 0.10847999900579453,
//       "id": "XqVXMn1LbuHIAwmf-tyMSQ"
//     }
//   ]
// }
