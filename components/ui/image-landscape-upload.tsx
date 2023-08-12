"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageLandscapeUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageLandscapeUpload: React.FC<ImageLandscapeUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[113px] rounded-md overflow-hidden">
            <Image fill className="object-cover" alt="image" src={value} />
          </div>
        )}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="g7qyqzuh"
        options={{
          maxFiles: 1,
          sources: ["local"],
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};
