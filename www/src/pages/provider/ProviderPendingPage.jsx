import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

function ProviderPendingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Registration Submitted</h1>
            <p className="text-gray-600 mb-4">Thank you — your registration has been received and is under review by our team.</p>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">What happens next:</p>
              <ol className="list-decimal list-inside text-left text-gray-700">
                <li>Super admin reviews your submission.</li>
                <li>If approved, your listing will be visible on the site and you will be able to sign in from the provider login page.</li>
                <li>If rejected, you'll receive instructions on how to resubmit.</li>
              </ol>
            </div>

            <div className="mt-6">
              <Link to="/provider/login" className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg">Go to Provider Login</Link>
            </div>

            <p className="text-xs text-gray-400 mt-6">Tip: Keep your contact number handy — admin may contact you for verification.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderPendingPage;
