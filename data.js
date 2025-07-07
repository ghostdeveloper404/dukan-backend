
const Product = require('./models/product.model');
const mongoose = require('./services/mongodb'); // your DB connection
const slugify = require('slugify');

async function addSlugs() {
  try {
    const products = await Product.find({ slug: { $exists: false } });

    for (const product of products) {
      const slug = slugify(product.name, { lower: true, strict: true });
      product.slug = slug;
      await product.save();
      console.log(`✅ Added slug: ${slug} to product: ${product.name}`);
    }

    console.log('🎉 All missing slugs added!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding slugs:', err);
    process.exit(1);
  }
}

addSlugs();
