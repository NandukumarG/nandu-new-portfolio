import Connect from './components/Connect'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import Tools from './components/Tools'
import Work from './components/Work'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Profile />
        <Tools />
        <Work />
        <Connect />
      </main>
    </>
  )
}

export default App
