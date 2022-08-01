import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    Location: { type: String, trim: true },
    gender: { type: String, trim: true, enum: ["Male", "Female", "LGBTQ", "Prefer not to say"] },//drop down list
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    Institute: { type: String, trim: true },
    profileImage: { type: String },
    postCount: { type: Number, default: 0 },
    posts: { type: Array, default: [] },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    Interest: { type: Array, trim: true },
    DOB: { type: String, trim: true },
    college: { type: String, trim: true },
    totalFollower: { type: Number, default: 0 },
    totalFollowing: { type: Number, default: 0 },
    followers: { type: Array, default: [] },
    followersRequest: { type: Array, default: [] },
    following: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false, trim: true },
    isDeactivated: { type: Boolean, default: false, trim: true },
    deletedAt: { type: Date, default: null }

}, { timestamps: true })

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

export default mongoose.model('user', userSchema)