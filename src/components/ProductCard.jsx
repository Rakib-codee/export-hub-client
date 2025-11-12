import { motion } from "framer-motion";

const RatingPill = ({ rating = 0 }) => (
	<span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-yellow-500">
			<path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z"/>
		</svg>
		{Number(rating).toFixed(1)}
	</span>
);

const ProductCard = ({ product }) => {
	const { _id, id, name, price, img, image, country, originCountry, rating, availableQuantity } = product;
	const pid = _id || id;
	return (
		<motion.a
			href={`/product/${pid ?? ""}`}
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.98 }}
			className="card bg-base-100 shadow-sm hover:shadow-lg transition-all card-eq"
		>
			<figure className="overflow-hidden">
				<div className="w-full aspect-4/3 bg-base-200">
					<img src={img || image} alt={name} className="w-full h-full object-cover" loading="lazy" />
				</div>
			</figure>
			<div className="card-body card-body-eq">
				<h3 className="card-title text-lg">{name}</h3>
				<p className="text-sm text-gray-600 line-clamp-1">Origin: {originCountry || country}</p>
				<div className="flex items-center justify-between">
					<RatingPill rating={rating} />
					<span className="text-xs text-gray-500">Qty: {availableQuantity ?? "-"}</span>
				</div>
				<div className="card-actions items-center justify-between pt-2 mt-auto">
					<span className="font-semibold">${price}</span>
					<button className="btn btn-sm btn-primary">See Details</button>
				</div>
			</div>
		</motion.a>
	);
};

export default ProductCard;

