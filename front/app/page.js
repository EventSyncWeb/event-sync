import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-1 flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">


      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />


      <div className="relative max-w-3xl space-y-8 text-center">





        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          EventSync
        </h1>


        <p className="max-w-2xl mx-auto text-lg text-blue-200/80 leading-relaxed">
          Interactive real-time event management platform.
          <br className="hidden sm:block" />
          <span className="text-blue-300/60">
            Consult the program, ask your questions and interact with the speakers.
          </span>
        </p>


        <div className="w-16 h-0.5 bg-blue-500 mx-auto rounded-full" />


        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <Link
            href="/events"
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            View events
          </Link>

          <Link
            href="/speakers"
            className="w-full sm:w-auto rounded-lg border border-blue-400/30 px-8 py-3.5 text-base font-medium text-blue-200 transition-all duration-200 hover:bg-blue-800/30 hover:border-blue-400/50 hover:text-white"
          >
            See the speakers
          </Link>
        </div>


        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-6 text-sm text-blue-300/50">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            Live events
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            Real-time interactions
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            Interactive Q&A
          </span>
        </div>
      </div>
    </div>
  );
}