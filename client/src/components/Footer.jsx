function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-20">
      <div className="max-w-7xl mx-auto py-12 px-8 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            NeuroCare AI
          </h2>
          <p className="text-blue-100">
            AI-powered educational guidance for child developmental
            milestones and early screening awareness.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-blue-100">
            <li>Home</li>
            <li>Assessment</li>
            <li>Learn</li>
            <li>About</li>
            <li>AI Chat</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Disclaimer
          </h3>
          <p className="text-blue-100">
            NeuroCare AI provides educational information only and is not a
            substitute for professional medical advice or diagnosis.
          </p>
        </div>
      </div>
      <div className="border-t border-blue-700 py-4 text-center text-blue-200">
        © 2026 NeuroCare AI. All Rights Reserved.
      </div>
    </footer>
  );
}
export default Footer;