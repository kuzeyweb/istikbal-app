import '../styles/globals.css'
import '../styles/bootstrap.css'
import '../styles/mob.css'
import '../styles/materialize.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Component {...pageProps} />
  )
}