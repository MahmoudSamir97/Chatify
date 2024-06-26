const protectRoute = require('../middlewares/protectRoute');
const upload = require('../middlewares/multer');
const updateSchema = require('../utils/validation-schema/updateSchema');
const { validation } = require('../middlewares/validation');
const userRouter = require('express').Router();
const {
  getUsersForSidebar,
  updateProfile,
  showProfile,
  addProfileImage,
  removeProfileImage,
  getSearchedUsers,
} = require('../controllers/userController');

userRouter.use(protectRoute);

userRouter.get('/conversations', getUsersForSidebar);

userRouter.get('/find', getSearchedUsers);

userRouter
  .route('/profile')
  .get(showProfile)
  .patch(validation({ body: updateSchema }), updateProfile);

userRouter
  .route('/profile-image')
  .post(upload.single('profileImage'), addProfileImage)
  .delete(removeProfileImage);

module.exports = userRouter;
