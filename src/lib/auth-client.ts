import { createAuthClient } from "better-auth/client"
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // The base URL of your auth server
})

// export const auth = betterAuth({
//     plugins: [
//         customSession(async ({ user, session }) => {
//             const roles = findUserRoles(session.session.userId);
//             return {
//                 roles,
//                 user: {
//                     ...user,
//                     newField: "newField",
//                 },
//                 session
//             };
//         }),
//     ],
// });