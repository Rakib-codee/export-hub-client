import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
	{
		title: "Connect Global Buyers & Sellers",
		subtitle: "Streamline your import/export operations with confidence.",
		image: "https://i.ibb.co/xt0fsMSB/variety-people-multitasking-3d-cartoon-scene.jpg"
	},
	{
		title: "Move Goods Faster",
		subtitle: "Track shipments and manage trade documents in one place.",
		image: "https://i.ibb.co/KpKgVtFX/cargo-ship-loading-commercial-port.jpg"
	},
	{
		title: "Scale to New Markets",
		subtitle: "Discover opportunities and trusted partners worldwide.",
		image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1600&auto=format&fit=crop"
	}
];

const HeroSlider = () => {
	return (
		<div className="relative">
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				navigation
				pagination={{ clickable: true }}
				autoplay={{ delay: 3500, disableOnInteraction: false }}
				loop
				className="h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden"
			>
				{slides.map((s, idx) => (
					<SwiperSlide key={idx}>
						<div className="w-full h-full relative">
							<img
								src={s.image}
								alt={s.title}
								className="absolute inset-0 w-full h-full object-cover"
								loading="eager"
							/>
							<div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/50" />
							<div className="relative h-full flex items-center justify-center text-center text-white p-6">
								<div className="max-w-3xl">
									<motion.h1
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6 }}
										className="text-3xl md:text-5xl font-bold"
									>
										{s.title}
									</motion.h1>
									<motion.p
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.1 }}
										className="mt-3 md:mt-4 text-base md:text-lg text-gray-200"
									>
										{s.subtitle}
									</motion.p>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.2 }}
										className="mt-6 flex items-center justify-center gap-3"
									>
										<a href="/all-products" className="btn btn-primary">Browse Products</a>
										<a href="/add-product" className="btn btn-outline">Add Export</a>
									</motion.div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default HeroSlider;


