import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <div className="min-h-screen bg-slate-800">
        {/* Retro grid background */}
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="fixed inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>

        <Navbar />

        <main className="min-h-[84.5vh] px-4 py-8 relative">
          <div className="max-w-5xl mx-auto">
            <Manager />
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default App