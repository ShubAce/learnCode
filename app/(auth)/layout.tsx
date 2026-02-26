import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
            <main className="flex flex-col items-center justify-center h-screen">
                {children}
            </main>
		</div>
	);
};

export default AuthLayout;
