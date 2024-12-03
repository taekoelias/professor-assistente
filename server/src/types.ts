import { TagData } from "./domain/tags.domain";
declare global {
  namespace PrismaJson {
    type TagDataType = TagData;
  }
}
