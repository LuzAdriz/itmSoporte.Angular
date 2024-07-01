import { QueryParam } from "../../decorators";
import PaginationGet from "./pagination-get";

abstract class InformationRequestSearchE {
  @QueryParam
  UserCreated?: string | null;

  @QueryParam
  Status?: string | null;

  @QueryParam
  StartDate?: Date | null;

  @QueryParam
  EndDate?: Date | null;

  Pagination?: PaginationGet;
}

export default InformationRequestSearchE;