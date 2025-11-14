import HeroSlider from "../components/HeroSlider.jsx";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Star, Earth, Ship, HandFist, TruckElectric } from "lucide-react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API = import.meta.env.VITE_API_BASE_URL || "https://export-hub-server.vercel.app";

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Import Export Hub | Home";
    
    // Fetch latest products from backend API
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(`${API}/models`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();
        
        // Get latest 10 products (or all if less than 10)
        // Sort by _id (newest first) or createdAt if available
        const sorted = products
          .sort((a, b) => {
            // If createdAt exists, use it, otherwise use _id
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
          })
          .slice(0, 10);
        
        setLatestProducts(sorted);
      } catch (error) {
        console.error("Error fetching latest products:", error);
        // Fallback to empty array on error
        setLatestProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const services = [
    { id: 1, title: "Sea Freight", desc: "Cost-effective ocean shipping solutions.", img: "https://cdn-icons-png.flaticon.com/512/1071/1071821.png", rating: 4.8 },
    { id: 2, title: "Air Freight", desc: "Fast and reliable for time-sensitive shipments.", img: "https://cdn-icons-png.flaticon.com/512/2769/2769393.png", rating: 4.9 },
    { id: 3, title: "Land Transport", desc: "Efficient domestic and cross-border transport.", img: "https://cdn-icons-png.flaticon.com/512/869/869869.png", rating: 4.7 },
    { id: 4, title: "Customs Brokerage", desc: "Expert clearance to ensure smooth border crossing.", img: "https://cdn-icons-png.flaticon.com/512/942/942748.png", rating: 4.6 },
  ];

   const companies = [
    { name: "Maersk", logo: "https://i.ibb.co/5hmG82wD/Maersk-Logo.png" },
    { name: "MSC", logo: "https://i.ibb.co/XZ5wmsF2/MSC-Logo.png" },
    { name: "CMA CGM", logo: "https://i.ibb.co/CKDJssgn/images-1.png" },
    { name: "Hapag-Lloyd", logo: "https://i.ibb.co/ZpR1xBNx/hapag-lloyd-2-logo-png-transparent.png" },
    { name: "DHL", logo: "https://i.ibb.co/mCmp7hQR/images.png" },
    { name: "FedEx", logo: "https://i.ibb.co/DD6B160q/fedex-logo-png-seeklogo-53457.png" },
  ];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };


  return (
    <div className="min-h-screen space-y-12">
      {/* Hero Slider */}
      <section className="px-4 md:px-6">
        <HeroSlider />
      </section>

      {/* Stats Strip */}
      <section className="px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-base-100 rounded-xl p-6">
          <div className="flex flex-col items-center">
            <Earth size={52} color="#26b5f2" strokeWidth={2.25} absoluteStrokeWidth />
            <div className="text-2xl font-bold mt-2">150+</div>
            <div className="text-xs text-gray-600 mt-1">Countries Served</div>
          </div>
          <div className="flex flex-col items-center">
            <Ship size={52} color="#26b5f2" strokeWidth={2.25} absoluteStrokeWidth />
            <div className="text-2xl font-bold mt-2">10,000+</div>
            <div className="text-xs text-gray-600 mt-1">Shipments Delivered</div>
          </div>
          <div className="flex flex-col items-center">
            <HandFist size={52} color="#26b5f2" strokeWidth={2.25} absoluteStrokeWidth />
            <div className="text-2xl font-bold mt-2">24/7</div>
            <div className="text-xs text-gray-600 mt-1">Customer Support</div>
          </div>
          <div className="flex flex-col items-center">
            <TruckElectric size={52} color="#26b5f2" strokeWidth={2.25} absoluteStrokeWidth />
            <div className="text-2xl font-bold mt-2">99.8%</div>
            <div className="text-xs text-gray-600 mt-1">On-Time Delivery</div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="px-4 md:px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-800 text-center mb-6">Our Services</h2>
        <Slider {...sliderSettings}>
          {services.map((service) => (
            <div key={service.id} className="p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-xl transition duration-300 text-center">
                <img src={service.img} alt={service.title} className="w-16 h-16 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{service.desc}</p>
                <div className="flex items-center justify-center mt-3 gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-400" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Latest Products Carousel */}
      <section className="px-4 md:px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">Our Latest Products</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No products available yet.</p>
          </div>
        ) : (
          <Slider {...sliderSettings}>
            {latestProducts.map((product) => (
              <div key={product._id || product.id} className="p-4">
                <Link to={`/product/${product._id || product.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer">
                    <img 
                      src={product.image || product.img} 
                      alt={product.name} 
                      className="w-full h-52 object-cover" 
                    />
                    <div className="p-5">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < Math.floor(product.rating || 0) ? "gold" : "none"} 
                              stroke="currentColor" 
                              className="text-yellow-400" 
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {(product.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        {product.price && (
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Features Row */}
      <section className="px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {[
            { title: "Trusted Partners", desc: "We verify exporters and buyers to ensure safe trade.", icon: "🤝" },
            { title: "Fast Logistics", desc: "Integrated shipping support for door-to-door delivery.", icon: "🚚" },
            { title: "Secure Payments", desc: "Escrow and LC guidance for international transactions.", icon: "💳" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Logos */}
     <section className="px-4 md:px-6 mt-16 text-center">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Trusted by Leading Companies
      </h3>

      <Slider {...settings}>
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="h-12 md:h-16 object-contain mx-auto"
            />
          </div>
        ))}
      </Slider>
    </section>
    </div>
  );
};

export default Home;
