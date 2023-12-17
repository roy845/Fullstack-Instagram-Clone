import { FileData } from "../types";

export const getFileTypeFromExtension = (fileExtension: string) => {
  switch (fileExtension.toLowerCase()) {
    case "png":
    case "jpeg":
    case "jpg":
      return "image";
    case "mkv":
    case "mp4":
    case "avi":
    case "mov":
    case "webm":
    case "flv":
    case "wmv":
    case "3gp":
      return "movie";
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "word";
    case "xls":
    case "xlsx":
      return "excel";
    case "ppt":
    case "pptx":
      return "powerpoint";
    case "txt":
      return "text";
    case "zip":
    case "rar":
      return "archive";
    default:
      return "song";
  }
};

export const filterFilesByType = (files: FileData[], type: string) => {
  return files?.filter((file) => file.type === type);
};

export const filterNamesWithAtSymbol = (sentence: string): string[] => {
  const regex = /@(\w+)/g;
  const matches = sentence.match(regex);

  if (matches) {
    const filteredNames = matches.map((match) => match.slice(1)); // Remove "@" symbol
    return filteredNames;
  } else {
    return [];
  }
};
