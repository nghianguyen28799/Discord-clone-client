import React from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";

interface UploadFileProps extends DropzoneProps {
  value: File[];
  onChange: (value: any) => void;
}
const UploadFile = (props: UploadFileProps) => {
  const { onChange, value, multiple = false, ...rest } = props;

  const onDrop = (acceptedFiles: any) => {
    onChange(acceptedFiles);
  };

  return (
    <Dropzone
      onDrop={onDrop}
      multiple={multiple}
      accept={{
        "image/*": [".jpeg", ".png", ".jpg"],
      }}
      {...props}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            className: "dropzone",
            onDrop: (event) => event.stopPropagation(),
          })}
        >
          <input {...getInputProps()} />
          <div className="w-full h-20 flex items-center justify-center p-4 border-2 rounded border-dashed border-slate-400 bg-[#e9e9ec] cursor-pointer">
            <p className="text-sm text-zinc-700 ">
              Drag and drop a file here, or click to select files
            </p>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadFile;
