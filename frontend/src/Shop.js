import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// --- ICONS ---
const Icons = {
  HeartOutline: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  HeartSolid: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>,
  Bag: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.17.678-.369 1.493-1.077 1.493H4.214a1.125 1.125 0 01-1.077-1.493l1.263-5a1.125 1.125 0 011.078-.853h13.04c.525 0 .985.349 1.078.853z" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Zoom: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>,
  Instagram: () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  Facebook: () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" /></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
};

// --- LOCAL BANNERS ---
const banners = [
  { id: 1, image: "/banners/1.jpg", title: "The Royal Kanjeevaram", subtitle: "Woven heritage for the modern bride." },
  { id: 2, image: "/banners/2.jpg", title: "The Pastel Edit", subtitle: "Soft hues for elegant day weddings." },
  { id: 3, image: "/banners/3.jpg", title: "Weaves of Banaras", subtitle: "Experience the timeless grace of silk." },
  { id: 4, image: "/banners/4.jpg", title: "Handloom Heritage", subtitle: "Authentic craftsmanship in every thread." },
  { id: 5, image: "/banners/5.jpg", title: "Festival Ready", subtitle: "Shine bright with our Zari collection." }
];

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('bramari_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('bramari_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const SELLER_NUMBER = "919491950909"; 
  
  const categories = ["All", "Silk", "Cotton", "Georgette", "Wedding", "Party Wear"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []); 

  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/products').then(res => res.json()).then(data => {
          setProducts(data);
          setFilteredProducts(data.reverse());
          setLoading(false);
      });
    }, 1000);
  }, []);

  useEffect(() => localStorage.setItem('bramari_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('bramari_cart', JSON.stringify(cart)), [cart]);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter(p => p.fabric.toLowerCase().includes(selectedCategory.toLowerCase()) || p.occasion.toLowerCase().includes(selectedCategory.toLowerCase()));
    if (searchTerm) result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.fabric.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortOption === "lowToHigh") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "highToLow") result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOption, products]);

  const addToCart = (product) => {
    if (cart.some(item => item._id === product._id)) {
        toast.error("This unique piece is already in your cart!", { position: "bottom-center", icon: '🚫' });
        return;
    }
    setCart([...cart, product]);
    toast.success("Added to Cart!", { position: "bottom-center", style: { background: '#4A0404', color: '#fff' } });
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    toast.error("Removed from Cart");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item._id === product._id);
    if (exists) {
      setWishlist(wishlist.filter(item => item._id !== product._id));
      toast.error("Removed from Wishlist", { position: "bottom-center" });
    } else {
      setWishlist([...wishlist, product]);
      toast.success("Saved to Wishlist", { position: "bottom-center" });
    }
  };
  const isInWishlist = (id) => wishlist.some(item => item._id === id);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    let message = "Hello! I would like to place an order for:\n\n";
    cart.forEach((item, index) => { 
        const itemLink = `${window.location.origin}/product/${item._id}`;
        message += `${index + 1}. *${item.title}* (₹${item.price})\n   🔗 ${itemLink}\n\n`; 
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `*Total Value:* ₹${total}\n\nAre these available?`;
    window.open(`https://wa.me/${SELLER_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-80 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-saree-cream flex flex-col font-sans overflow-x-hidden relative">
      <Toaster />
      
      {/* FULL SCREEN MODAL */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4 animate-fadeIn">
          <button onClick={() => setFullScreenImage(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition"><Icons.Close /></button>
          <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-screen object-contain" />
        </div>
      )}

      {/* NAVBAR (UPDATED BIGGER LOGO) */}
      <nav className="bg-white/95 backdrop-blur-md text-saree-maroon p-4 sticky top-0 z-50 shadow-sm flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-3">
            {/* Logo increased from h-12 w-12 to h-20 w-20 */}
            <img src="/logo.jpg" alt="Bramari Logo" className="h-20 w-20 rounded-full object-cover border-2 border-saree-gold shadow-md transition-transform hover:scale-105" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wider text-saree-maroon">Bramari</h1>
        </div>

        <div className="flex gap-5 items-center">
           <button onClick={() => setIsWishlistOpen(true)} className="relative hover:scale-110 transition p-2">
             <Icons.HeartOutline />
             {wishlist.length > 0 && <span className="absolute top-0 right-0 bg-saree-maroon text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>}
           </button>
           <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition p-2">
             <Icons.Bag />
             {cart.length > 0 && <span className="absolute top-0 right-0 bg-saree-maroon text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
           </button>
        </div>
      </nav>

      {/* HERO SLIDER */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-saree-maroon">
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
                src={banner.image} 
                alt="Banner" 
                className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-100' : 'scale-100'}`} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/1500x800/4a0404/ffffff?text=Add+Images+In+Public+Folder"; }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-saree-maroon via-saree-maroon/40 to-transparent flex flex-col items-center justify-center text-center px-4">
              <div className="max-w-3xl animate-slideUp">
                 <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-2xl text-saree-gold">{banner.title}</h2>
                 <p className="text-xl md:text-3xl text-white/95 mb-10 font-light tracking-wider">{banner.subtitle}</p>
                 <button onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })} className="bg-saree-gold text-saree-maroon px-10 py-4 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-white transition shadow-2xl">Shop Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="collection" className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-16 w-full bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between p-2">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar items-center">
            <span className="text-xs font-bold uppercase text-gray-400 mr-2">Filter:</span>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition border ${selectedCategory === cat ? "bg-saree-maroon text-white border-saree-maroon" : "bg-white text-gray-600 border-gray-200 hover:border-saree-maroon"}`}>{cat}</button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-saree-maroon" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            </div>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none cursor-pointer">
              <option value="newest">✨ Newest</option>
              <option value="lowToHigh">💰 Low to High</option>
              <option value="highToLow">💎 High to Low</option>
            </select>
          </div>
        </div>

        {/* PROMO BANNER (LOCAL) */}
        <div className="mb-16 rounded-2xl overflow-hidden relative h-64 md:h-80 shadow-2xl group cursor-pointer border-4 border-white">
           <img 
                src="/banners/promo.jpg" 
                alt="Promo" 
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-105 brightness-[0.7]" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/1500x500/4a0404/ffffff?text=Add+promo.jpg+in+Public/Banners"; }}
           />
           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 border-white/20 m-4 border rounded-xl">
              <span className="text-saree-gold font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">Limited Edition</span>
              <h3 className="text-3xl md:text-6xl font-serif text-white font-bold mb-6 drop-shadow-lg">The Bridal Edit</h3>
           </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />) : filteredProducts.length === 0 ? <div className="col-span-full text-center py-20 text-gray-500">No sarees found.</div> : 
             filteredProducts.map((saree) => (
              <div key={saree._id} className="bg-white rounded-lg shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100 group flex flex-col relative">
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <button onClick={() => toggleWishlist(saree)} className="bg-white/90 p-2 rounded-full shadow hover:scale-110 transition text-saree-maroon">
                        {isInWishlist(saree._id) ? <Icons.HeartSolid /> : <Icons.HeartOutline />}
                    </button>
                    {saree.images && saree.images.length > 0 && (
                        <button onClick={() => setFullScreenImage(saree.images[0])} className="bg-white/90 p-2 rounded-full shadow hover:scale-110 transition text-gray-600 hover:text-saree-maroon" title="View Full Screen">
                            <Icons.Zoom />
                        </button>
                    )}
                </div>
                <Link to={`/product/${saree._id}`}>
                  <div className="h-96 bg-gray-50 p-2 overflow-hidden cursor-pointer flex items-center justify-center">
                    {saree.images && saree.images.length > 0 ? (
                      <img src={saree.images[0]} alt={saree.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} className="transition duration-700 group-hover:scale-110" />
                    ) : <div className="text-gray-400">No Image</div>}
                  </div>
                </Link>
                <div className="p-4 text-center flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{saree.fabric}</div>
                  <Link to={`/product/${saree._id}`}><h3 className="text-lg font-serif font-bold text-gray-900 mb-2 hover:text-saree-maroon cursor-pointer truncate px-2">{saree.title}</h3></Link>
                  <div className="flex justify-center items-center gap-2 mb-4 mt-auto">
                    <span className="text-gray-400 line-through text-xs">₹{Math.round(saree.price * 1.2)}</span>
                    <span className="text-saree-maroon font-bold text-lg">₹{saree.price}</span>
                  </div>
                  <button onClick={() => addToCart(saree)} className="w-full bg-white border border-saree-maroon text-saree-maroon font-bold py-2 rounded hover:bg-saree-maroon hover:text-white transition uppercase text-xs tracking-wider flex items-center justify-center gap-2">Add to Cart</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* FOOTER (UPDATED BIGGER LOGO) */}
      <footer className="bg-saree-maroon text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
                {/* Logo increased from h-14 w-14 to h-24 w-24 */}
                <img src="/logo.jpg" alt="Bramari Logo" className="h-24 w-24 rounded-full border-2 border-saree-gold transition-transform hover:scale-105" />
                <h3 className="text-4xl font-serif font-bold text-saree-gold">Bramari</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md font-serif italic">"Where tradition meets technology. Curating the finest handwoven Indian sarees for the modern connoisseur."</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-saree-gold uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3 text-gray-300">
              <li><button onClick={() => {setSelectedCategory("Silk"); document.getElementById('collection').scrollIntoView()}} className="hover:text-saree-gold transition">Silk Sarees</button></li>
              <li><button onClick={() => {setSelectedCategory("Wedding"); document.getElementById('collection').scrollIntoView()}} className="hover:text-saree-gold transition">Wedding Collection</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-saree-gold uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919491950909" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                  <Icons.Phone /> +91 94919 50909
                </a>
              </li>
              <li>
                <a href="mailto:bramarisilks@gmail.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                  <Icons.Mail /> bramarisilks@gmail.com
                </a>
              </li>
            </ul>
            
            <div className="flex gap-4 mt-6">
               <a href="https://www.instagram.com/bramarisilks?igsh=bTNoMHR1NGZrYXBv" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-saree-gold hover:text-saree-maroon cursor-pointer transition text-lg">
                 <Icons.Instagram />
               </a>
               <a href="https://facebook.com/bramarisilks" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-saree-gold hover:text-saree-maroon cursor-pointer transition text-lg">
                 <Icons.Facebook />
               </a>
            </div>
          </div>
        </div>
        <div className="text-center border-t border-white/10 pt-10 text-sm text-gray-400"><p>© 2025 Bramari Fashion. All Rights Reserved.</p></div>
      </footer>

      {/* CART SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end backdrop-blur-sm">
          <div className="bg-white w-full md:w-96 h-full p-6 shadow-2xl flex flex-col animate-slideIn">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-serif text-saree-maroon flex items-center gap-2"><Icons.Bag /> Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}><Icons.Close /></button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {cart.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-gray-400"><Icons.Bag /><p>Your cart is empty.</p></div> : cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                    <Link to={`/product/${item._id}`} onClick={() => setIsCartOpen(false)} className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200 p-1 block">
                       {item.images && <img src={item.images[0]} alt="thumb" className="w-full h-full object-contain" />}
                    </Link>
                    <div className="flex-grow">
                      <Link to={`/product/${item._id}`} onClick={() => setIsCartOpen(false)} className="block">
                        <p className="font-bold truncate w-32 text-gray-800 hover:text-saree-maroon transition">{item.title}</p>
                      </Link>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded transition" title="Remove"><Icons.Close className="w-5 h-5" /></button>
                  </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between text-xl font-bold mb-4 text-saree-maroon"><span>Total:</span><span>₹{cart.reduce((sum, item) => sum + item.price, 0)}</span></div>
              <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex justify-center items-center gap-2">Checkout on WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST SIDEBAR */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end backdrop-blur-sm">
          <div className="bg-white w-full md:w-96 h-full p-6 shadow-2xl flex flex-col border-l-4 border-saree-gold animate-slideIn">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-serif text-saree-maroon flex items-center gap-2"><Icons.HeartSolid /> My Wishlist</h2>
              <button onClick={() => setIsWishlistOpen(false)}><Icons.Close /></button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {wishlist.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-gray-400"><Icons.HeartOutline /><p>Your wishlist is empty.</p></div> : wishlist.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                    <Link to={`/product/${item._id}`} onClick={() => setIsWishlistOpen(false)} className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200 p-1 block">
                       {item.images && <img src={item.images[0]} alt="thumb" className="w-full h-full object-contain" />}
                    </Link>
                    <div className="flex-grow">
                      <Link to={`/product/${item._id}`} onClick={() => setIsWishlistOpen(false)} className="block">
                        <p className="font-bold truncate w-40 text-gray-800 hover:text-saree-maroon transition">{item.title}</p>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">₹{item.price}</p>
                      <button onClick={() => { addToCart(item); toggleWishlist(item); }} className="text-[10px] bg-saree-maroon text-white px-3 py-1.5 rounded uppercase tracking-wide hover:bg-opacity-90 shadow-sm">Move to Cart</button>
                    </div>
                    <button onClick={() => toggleWishlist(item)} className="text-gray-300 hover:text-red-500 transition"><Icons.Close /></button>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;