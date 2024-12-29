import React, { useState } from 'react';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    slug: '',
    description: '',
    size: '',
    color: '',
    moq: '',
    originalPrice: '',
    discountedPrice: '',
    subcategory: '', // Added subcategory field
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProductData({
      ...productData,
      images: [...productData.images, ...e.target.files],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      for (const key in productData) {
        if (key === 'images') {
          productData.images.forEach((file) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      }

      const response = await fetch('https://admin-backend-rl94.onrender.com/api/products/add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        setProductData({
          name: '',
          category: '',
          slug: '',
          description: '',
          size: '',
          color: '',
          moq: '',
          originalPrice: '',
          discountedPrice: '',
          subcategory: '', // Reset subcategory
          images: [],
        }); // Reset form data
      } else {
        throw new Error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-16">
      <h4 className="text-sm font-semibold mb-6 bg-white px-2 rounded-full shadow-lg shadow-blue-500 text-center cursor-pointer hover:bg-blue-100">
        Create New Product
      </h4>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Product Slug */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Product Slug</label>
            <input
              type="text"
              name="slug"
              value={productData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              rows="4"
            />
          </div>

          {/* Size & Color in one row */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Size (in ft)</label>
              <input
                type="text"
                name="size"
                value={productData.size}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={productData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* MOQ & Price in one row */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">MOQ (Minimum Order Quantity)</label>
              <input
                type="number"
                name="moq"
                value={productData.moq}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={productData.originalPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Discounted Price */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Discounted Price</label>
            <input
              type="number"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Subcategory */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={productData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Images</label>
            <div className="relative">
              <input
                type="file"
                name="images"
                onChange={handleImageChange}
                multiple
                className="w-full px-4 py-2 border rounded-md opacity-0 absolute top-0 left-0"
              />
              <button
                type="button"
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Choose Files
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
