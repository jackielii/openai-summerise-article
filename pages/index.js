import Head from 'next/head'
import { useState } from 'react'
import clsx from 'clsx'

import styles from './index.module.css'

export default function Home() {
  const [articleInput, setArticleInput] = useState('')
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  async function onSubmit(event) {
    setLoading(true)
    event.preventDefault()
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article: articleInput }),
      })

      const data = await response.json()
      setLoading(false)
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setResult(data.result)
      setShowResult(true)
    } catch (error) {
      setLoading(false)
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>Generate Summary</title>
        <link rel="icon" href="/target-logo.svg" />
      </Head>

      <main className={styles.main}>
        <nav>
          <header>
            <img src="/target-logo.svg" className={styles.icon} />
          </header>
          <span>
            <h1>Generate Summary</h1>
          </span>
        </nav>
        <section className={styles.content}>
          <form onSubmit={onSubmit}>
            <textarea
              className={styles.input}
              type="text"
              name="article"
              placeholder="Paste your article here"
              value={articleInput}
              onChange={(e) => setArticleInput(e.target.value)}
              onFocus={() => setShowResult(false)}
            />
            <input type="submit" disabled={loading} value="Generate" />
          </form>
          <textarea
            readOnly
            className={clsx(styles.result, showResult && styles.show)}
            placeholder="Summary will appear here..."
            value={loading ? 'Loading...' : result}
            onFocus={() => setShowResult(true)}
          />
        </section>
      </main>
    </div>
  )
}
