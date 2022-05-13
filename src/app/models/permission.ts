export interface Permission {
  id: number,
  description: string,
  type: "PERMISSION_MANAGEMENT" | "BUG_MANAGEMENT" | "BUG_CLOSE" | "BUG_EXPORT_PDF" | "USER_MANAGEMENT"
}
