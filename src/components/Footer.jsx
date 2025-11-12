const Footer = () => {
	return (
		<footer className="mt-16 border-t">
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
				<div className="col-span-2">
					<div className="text-lg font-bold">Import Export Hub</div>
					<p className="mt-3 text-sm text-gray-600">
						Modern platform for global trade. Discover, connect, and ship with confidence.
					</p>
					<div className="mt-4 flex items-center gap-3">
						<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="btn btn-ghost btn-sm p-2 rounded-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v6h3v-6h2.09L16 11h-3v-1.5c0-.28.22-.5.5-.5z"/></svg>
						</a>
						<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="btn btn-ghost btn-sm p-2 rounded-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" className="w-5 h-5 fill-current"><path d="M714.163 519.284L1127.05 0H1029.78L671.591 450.887L385.474 0H0L433.931 631.527L0 1226.37H97.2657L472.975 748.002L774.526 1226.37H1160L714.137 519.284H714.163ZM522.341 678.169L478.444 615.972L132.661 79.6944H331.826L619.611 494.227L663.508 556.424L1029.84 1147.68H830.675L522.341 678.194V678.169Z"/></svg>
						</a>
						<a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn btn-ghost btn-sm p-2 rounded-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6.94 6.5A2.44 2.44 0 1 1 6.93 1.6a2.44 2.44 0 0 1 .01 4.9zM3.97 8.38h5.95V22H3.97zM14.07 8.38h-5.1V22h5.1v-6.77c0-3.77 4.88-4.08 4.88 0V22H24v-7.93c0-6.81-7.73-6.56-9.93-3.21z"/></svg>
						</a>
						<a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="btn btn-ghost btn-sm p-2 rounded-full">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 .5C5.73.5.95 5.27.95 11.53c0 4.86 3.16 8.98 7.55 10.43.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.06-3.07.67-3.72-1.3-3.72-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.58 1.19 3.21.91.1-.71.38-1.2.7-1.48-2.45-.28-5.02-1.23-5.02-5.47 0-1.21.43-2.2 1.13-2.97-.11-.28-.49-1.43.11-2.99 0 0 .93-.3 3.05 1.13.89-.24 1.84-.36 2.78-.36.94 0 1.89.12 2.78.36 2.12-1.43 3.05-1.13 3.05-1.13.6 1.56.22 2.71.11 2.99.7.76 1.13 1.76 1.13 2.97 0 4.25-2.58 5.18-5.04 5.46.39.33.74.98.74 1.96 0 1.42-.01 2.57-.01 2.92 0 .29.2.63.76.53 4.38-1.46 7.54-5.58 7.54-10.44C23.05 5.27 18.27.5 12 .5z"/></svg>
						</a>
					</div>
				</div>
				<div>
					<div className="font-semibold">Explore</div>
					<ul className="mt-3 space-y-2 text-sm">
						<li><a href="/all-products" className="link link-hover">All Products</a></li>
						<li><a href="/add-product" className="link link-hover">Add Export</a></li>
						<li><a href="/my-imports" className="link link-hover">My Imports</a></li>
						<li><a href="/my-exports" className="link link-hover">My Exports</a></li>
					</ul>
				</div>
				<div>
					<div className="font-semibold">Company</div>
					<ul className="mt-3 space-y-2 text-sm">
						<li><a className="link link-hover">About</a></li>
						<li><a className="link link-hover">Careers</a></li>
						<li><a className="link link-hover">Blog</a></li>
						<li><a className="link link-hover">Press</a></li>
					</ul>
				</div>
				<div>
					<div className="font-semibold">Contact</div>
					<ul className="mt-3 space-y-2 text-sm">
						<li><a href="mailto:support@importexporthub.com" className="link link-hover">support@importexporthub.com</a></li>
						<li><a href="tel:+8801700000000" className="link link-hover">+880 1700-000000</a></li>
						<li><span className="text-gray-600">Dhaka, Bangladesh</span></li>
					</ul>
				</div>
			</div>
			<div className="border-t py-4 text-center text-xs text-gray-500">
				© {new Date().getFullYear()} Import Export Hub. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;

