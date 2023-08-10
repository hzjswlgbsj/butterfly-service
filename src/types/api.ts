export interface FileAddResData {}
export interface FileEditParams extends FileEditReq {
  id?: number;
  guid?: string;
}
export interface FileEditReq {
  name?: string;
  content?: string;
}
export interface FileGetReq {
  id?: number;
  type?: string;
  page?: number;
  limit?: number;
}
