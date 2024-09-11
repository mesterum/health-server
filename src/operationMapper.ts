import { AppRoute } from "@ts-rest/core";
import type { SecurityRequirementObject, OperationObject } from "openapi3-ts";

const hasCustomTags = (
  metadata: unknown
): metadata is { openApiTags: string[]; } => {
  return (
    !!metadata &&
    typeof metadata === 'object' &&
    'openApiTags' in metadata
  );
};
const hasSecurity = (
  metadata: unknown
): metadata is { openApiSecurity: SecurityRequirementObject[]; } => {
  return (
    !!metadata &&
    typeof metadata === 'object' &&
    'openApiSecurity' in metadata
  );
};
export const operationMapper = (operation: OperationObject, appRoute: AppRoute): OperationObject => ({
  ...operation,
  ...(hasCustomTags(appRoute.metadata)
    ? {
      tags: appRoute.metadata.openApiTags,
    }
    : {}),
  ...(hasSecurity(appRoute.metadata)
    ? {
      security: appRoute.metadata.openApiSecurity,
    }
    : {}),
});
