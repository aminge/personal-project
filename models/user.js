// I don't think I need this file

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema);