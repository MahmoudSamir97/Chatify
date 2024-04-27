import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import avatarImg from "../../assets/images/avatar.png";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <div
      className="mt-1 w-70 text-sm bg-green-200 hover:bg-green-100 rounded-lg shadow-lg z-10 cursor-pointer"
      onClick={handleFunction}
    >
      <div key={user.id} className="flex items-center p-2 ">
        <img
          src={user.image || avatarImg}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <p className="text-gray-900 font-semibold">{user.username}</p>
          <label htmlFor="">Email: </label>
          <p className="text-gray-500 inline">{user.email}</p>
        </div>
      </div>
    </div>
  );

  // <Box
  //   onClick={handleFunction}
  //   cursor="pointer"
  //   bg="#38B2AC"
  //   // bg="#E8E8E8"
  //   _hover={{
  //     background: "#38B2AC",
  //     color: "white",
  //   }}
  //   w="100%"
  //   d="flex"
  //   alignItems="center"
  //   color="black"
  //   px={3}
  //   py={2}
  //   mb={2}
  //   borderRadius="lg"
  // >
  //   {/* <Avatar
  //     mr={2}
  //     size="sm"
  //     cursor="pointer"
  //     name={user?.username}
  //     src={user?.profileImg}
  //   /> */}
  //   <Box>
  //     <Text>{user?.username}</Text>
  //     <Text fontSize="xs">
  //       <b>Email : </b>
  //       {user?.email}
  //     </Text>
  //   </Box>
  // </Box>
};

export default UserListItem;
