/**
 * Exports data as a downloadable CSV file.
 * @param filename - The name of the file (without extension).
 * @param headers - Array of column header strings.
 * @param rows - 2D array of string values (one array per row).
 */
export function exportToCsv(
    filename: string,
    headers: string[],
    rows: string[][]
): void {
    const escape = (value: string): string => {

        const str = value ?? "";
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvLines = [
        headers.map(escape).join(","),
        ...rows.map((row) => row.map(escape).join(",")),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
