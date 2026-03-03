import React from "react";
import { useRouter } from "next/navigation";

type BackButtonProps = {
	children?: React.ReactNode;
	className?: string;
};

export default function BackButton({ children, className = "" }: BackButtonProps) {
	const router = useRouter();
	return (
		<button
			onClick={() => router.back()}
			aria-label="Go back"
			className={"inline-flex items-center px-2 py-1 rounded-md hover:bg-slate-100 text-sm " + className}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
				<path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
			</svg>
			{children ? <span className="ml-2">{children}</span> : null}
		</button>
	);
}
