import React from 'react';
import Navbar from './Navbar'; // We will create this next

/**
 * A layout component that includes the Navbar and wraps the main content
 * of all protected pages.
 * @param {object} { children } - The page component to be rendered inside the layout.
 */
const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* The sidebar can be added here later if you choose */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
