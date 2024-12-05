import { TagMetadata } from "./domain/tags.domain";
declare global {
  namespace PrismaJson {
    type TagDataType = Partial<TagMetadata>;
  }
}
