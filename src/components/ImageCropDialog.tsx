import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropDialog: React.FC = () => {
  const [crop, setCrop] = useState<Crop | null>(null);

  return <div className="overlay"></div>;
};

export default ImageCropDialog;
