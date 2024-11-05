import mongoose from "mongoose";


const soldSchema = new mongoose.Schema({
  sold: {
    type: Number,
    default:0,
    min: 0,
  }
},
  {
    timestamps: true}
)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default:1,
    min: 0,
  },
  userquantity: {
    type: Number,
    default:1,
    min: 1,
  },
  sold:{
    type:[ soldSchema ],
  },
},{
    timestamps:true
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// const Product = mongoose.model('Product', productSchema);

export default productSchema 
