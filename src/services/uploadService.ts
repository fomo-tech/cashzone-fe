import http from "./api";

export interface UploadImageResponse {
  statusCode: string;
  message: string;
  data: {
    imageUrl: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}

export interface UploadImagesResponse {
  statusCode: string;
  message: string;
  data: {
    images: {
      imageUrl: string;
      filename: string;
      mimetype: string;
      size: number;
    }[];
    count: number;
  };
}

class UploadService {
  // Upload single image
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await http.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Upload multiple images
  async uploadImages(files: File[]): Promise<UploadImagesResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await http.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

export default new UploadService();
