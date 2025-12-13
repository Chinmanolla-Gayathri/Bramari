import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Admin() {
  const [products, setProducts] = useState([]);
  
  // EDITING STATE
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  // FORM STATE
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "", fabric: "", color: "", pattern: "", occasion: "", description: "", price: ""
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    fetch('https://bramari.onrender.com/products').then(res => res.json()).then(data => setProducts(data));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setPreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // START EDITING
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title,
      fabric: product.fabric,
      color: product.color,
      pattern: product.pattern,
      occasion: product.occasion,
      description: product.description,
      price: product.price
    });
    setExistingImages(product.images || []);
    setSelectedFiles([]);
    setPreviews([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("Editing Mode Active ✏️", { icon: "📝" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", fabric: "", color: "", pattern: "", occasion: "", description: "", price: "" });
    setExistingImages([]);
    setSelectedFiles([]);
    setPreviews([]);
    toast("Cancelled Edit");
  };

  // AI ANALYZE (Gemini Only)
  const generateDescription = async () => {
    if (selectedFiles.length === 0) return toast.error("Upload a new image to analyze!");
    
    setLoading(true);
    const data = new FormData();
    selectedFiles.forEach(file => data.append('images', file));

    try {
      const res = await fetch('https://bramari.onrender.com/generate-description', { method: 'POST', body: data });
      const result = await res.json();
      setFormData(prev => ({ ...prev, ...result, price: prev.price }));
      toast.success("Gemini Analysis Complete! 🧠");
    } catch (error) { toast.error("AI Analysis Failed"); }
    setLoading(false);
  };

  // SAVE OR UPDATE PRODUCT
  const saveProduct = async () => {
    const toBase64 = (file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
    const newBase64Images = await Promise.all(selectedFiles.map(file => toBase64(file)));
    
    const finalImages = [...existingImages, ...newBase64Images];

    if (finalImages.length === 0) return toast.error("Please upload at least one image!");

    const productPayload = { ...formData, images: finalImages };

    try {
      let res;
      if (editingId) {
        // UPDATE
        res = await fetch(`https://bramari.onrender.com/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload),
        });
      } else {
        // CREATE
        res = await fetch('https://bramari.onrender.com/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload),
        });
      }

      if (res.ok) {
        toast.success(editingId ? "Product Updated! 🔄" : "Product Created! ✅");
        cancelEdit();
        fetchProducts();
      } else {
        toast.error("Operation Failed");
      }
    } catch (error) { toast.error("Server Error"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this saree permanently?")) {
      await fetch(`https://bramari.onrender.com/products/${id}`, { method: 'DELETE' });
      fetchProducts();
      toast.success("Deleted!");
    }
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  return (
    <div className="min-h-screen bg-saree-cream py-10 px-4 flex flex-col items-center">
      <Toaster />
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-saree-maroon">✨ Bramari Admin</h1>
        <Link to="/" className="text-saree-maroon font-bold underline">← Go to Shop</Link>
      </div>
      
      <div className={`w-full max-w-6xl grid md:grid-cols-2 gap-8 mb-16 p-6 rounded-xl border-2 ${editingId ? "bg-yellow-50 border-yellow-400" : "bg-white border-saree-gold"}`}>
        
        <div className="col-span-full flex justify-between items-center border-b pb-4 mb-2">
          <h2 className="text-2xl font-serif text-saree-maroon">
            {editingId ? `✏️ Editing: ${formData.title}` : "1. Add New Saree"}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
              Cancel Edit ✕
            </button>
          )}
        </div>

        {/* LEFT: IMAGES */}
        <div className="bg-white/50 p-4 rounded">
          <label className="block font-bold mb-2">Manage Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mb-4 w-full" />
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {existingImages.map((src, idx) => (
              <div key={`exist-${idx}`} className="h-24 border-2 border-blue-200 bg-blue-50 rounded relative group">
                 <img src={src} alt="existing" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                 <button onClick={() => removeExistingImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
              </div>
            ))}
            {previews.map((src, idx) => (
              <div key={`new-${idx}`} className="h-24 border-2 border-green-200 bg-green-50 rounded">
                 <img src={src} alt="new" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            ))}
          </div>

          <button onClick={generateDescription} disabled={selectedFiles.length === 0 || loading} className="w-full bg-saree-maroon text-saree-gold font-bold py-3 rounded text-sm disabled:opacity-50">
                {loading ? "Analyzing..." : "✨ Gemini Analyze"}
          </button>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="bg-white/50 p-4 rounded space-y-4">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-4">
               <input name="fabric" placeholder="Fabric" value={formData.fabric} onChange={handleChange} className="w-full p-2 border rounded" />
               <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} className="w-full p-2 border border-saree-gold rounded font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="w-full p-2 border rounded" />
               <input name="pattern" placeholder="Pattern" value={formData.pattern} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <textarea name="description" placeholder="Description" rows="3" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
            
            <button onClick={saveProduct} disabled={!formData.title} className={`w-full font-bold py-3 rounded text-white shadow-lg transition ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-700 hover:bg-green-800"}`}>
               {editingId ? "💾 Update Product" : "💾 Save New Product"}
            </button>
        </div>
      </div>

      {/* INVENTORY LIST */}
      <div className="w-full max-w-6xl pb-20">
        <h2 className="text-3xl font-serif text-saree-maroon mb-6 border-b border-saree-gold pb-2">📦 Current Inventory</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-saree-maroon text-saree-gold">
                <tr><th className="p-4">Image</th><th className="p-4">Title</th><th className="p-4">Price</th><th className="p-4">Actions</th></tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id} className={`border-b hover:bg-gray-50 transition ${editingId === item._id ? "bg-yellow-50" : ""}`}>
                    <td className="p-4">
                      {item.images && item.images[0] && (
                        <div className="w-16 h-16 bg-gray-100 border rounded p-1">
                           <img src={item.images[0]} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold">{item.title}</td>
                    <td className="p-4">₹{item.price}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-bold text-sm">✏️ Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-bold text-sm">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;