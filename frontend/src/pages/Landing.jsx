import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

// --- SVG Icons (No changes needed here) ---
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const Landing = () => {
    return (
        <div className="bg-gray-50 font-sans text-gray-800">
            {/* --- Header --- */}
            <header className="absolute top-0 left-0 w-full z-10">
                {/* On mobile, items stack vertically. On medium screens and up, they are in a row. */}
                <nav className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-2xl font-bold text-gray-800">FinanceTracker</div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-blue-500 font-semibold">Login</Link>
                        <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </header>

            <main>
                {/* --- Hero Section --- */}
                <section className="relative min-h-screen flex items-center justify-center bg-white pt-24 md:pt-0">
                    <div className="absolute inset-0 bg-blue-500 opacity-10"></div>
                    <div className="text-center z-10 px-4">
                        {/* Smaller text on mobile, larger on medium screens and up */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight">
                            Take Control of Your Finances
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            The simple, secure way to track your spending, visualize your habits, and achieve your financial goals.
                        </p>
                        <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-xl text-base sm:text-lg transition duration-300 transform hover:scale-105">
                            Get Started for Free
                        </Link>
                    </div>
                </section>

                {/* --- Features Section --- */}
                <section className="py-16 sm:py-20 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why You'll Love FinanceTracker</h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Everything you need to manage your money effectively.</p>
                        {/* On mobile, this is a single column grid. On medium screens, it's 3 columns. */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Feature 1 */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="flex justify-center mb-4"><WalletIcon /></div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Track Every Penny</h3>
                                <p className="text-gray-600">
                                    Easily log your income and expenses. Categorize transactions to see exactly where your money goes.
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="flex justify-center mb-4"><ChartIcon /></div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Visualize Your Habits</h3>
                                <p className="text-gray-600">
                                    Interactive charts and reports turn your data into powerful insights, helping you make smarter decisions.
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="flex justify-center mb-4"><LockIcon /></div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Secure & Private</h3>
                                <p className="text-gray-600">
                                    Your data is your own. We use industry-standard security to keep your financial information safe.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Call to Action Section --- */}
                <section className="bg-blue-600 text-white">
                    <div className="container mx-auto px-6 py-16 sm:py-20 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Financial Journey?</h2>
                        <p className="text-blue-100 text-lg mb-8">Join thousands of users building a better financial future.</p>
                        <Link to="/register" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-xl text-base sm:text-lg transition duration-300 transform hover:scale-105">
                            Create Your Free Account
                        </Link>
                    </div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-6 text-center">
                    <p>&copy; {new Date().getFullYear()} FinanceTracker. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
