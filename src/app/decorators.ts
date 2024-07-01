export function QueryParam(target: any, propertyKey: string) {
  if (!target.__queryParams) {
    target.__queryParams = [];
  }
  target.__queryParams.push(propertyKey);
}
