export * from "./api";
export * from "./auth";
export * from "./comment";
export * from "./feed";
export * from "./follow";
export * from "./like";
export * from "./me";
export * from "./post";
// export * from "./save";
export * from "./user";

// GET /api/me

// curl -X 'PATCH' \
//   'https://be-social-media-api-production.up.railway.app/api/me' \
//   -H 'accept: */*' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTY3LCJ1c2VybmFtZSI6InRvbm9ndyIsImlhdCI6MTc4MzM0NzgwMSwiZXhwIjoxNzgzOTUyNjAxfQ.tkMEyrb34IhluRx3yX0H_-NxCijJmRtov1yH1zi70qo' \
//   -H 'Content-Type: multipart/form-data' \
//   -F 'name=tono' \
//   -F 'username=tonog' \
//   -F 'phone=08121345' \
//   -F 'bio=bio' \
//   -F 'avatar=@image-testi-kevin.png;type=image/png' \
//   -F 'avatarUrl=https://picsum.com/200/300'

// export interface UpdataMyProfile {
//   success: string;
//   username: string;
//   phone: string;
//   bio: string;
//   avatar: string;
//   avatarUrl: string;
// }
