export type outputFormat = "json" | "geojson";
export type geometryType = "esriGeometryPoint" | "esriGeometryMultipoint" | "esriGeometryPolyline" | "esriGeometryPolygon" | "esriGeometryEnvelope";
export type spatialRel = "esriSpatialRelIntersects" | "esriSpatialRelContains" | "esriSpatialRelCrosses" | "esriSpatialRelEnvelopeIntersects" | "esriSpatialRelIndexIntersects" | "esriSpatialRelOverlaps" | "esriSpatialRelTouches" | "esriSpatialRelWithin";
export type units = "esriSRUnit_Meter" | "esriSRUnit_StatuteMile" | "esriSRUnit_Foot" | "esriSRUnit_Kilometer" | "esriSRUnit_NauticalMile" | "esriSRUnit_USNauticalMile";

export class StatisticDefinition {
    statisticType: "count" | "sum" | "min" | "max" | "avg" | "stddev" | "var";
    outStatisticField: string;
    outStatisticFieldName: string;
}

export class QuantizationParameter {
    extent: any;
    mode: string;
    originPosition: "upperLeft" | "lowerLeft";
    tolerance: number;
}

export default class Query {
    f: outputFormat;
    where: string;
    objectIds: number[];
    geometry: any; //TODO: create geometry type
    inSR: number; // TODO: add additional support for spatialReference object.
    spatialRel: spatialRel;
    relationParam: string; // TODO: Add restriction /[FT\*]{0,9}/
    time: Date; // Convert to int upon conversion to string.
    distance: number;
    units: units;
    outFields: string[] | "*"; // TODO: Convert to comma separated list.
    returnGeometry: boolean;
    maxAllowableOffset: number;
    geometryPrecision: number;
    gdbVersion: string;
    returnDistinctValues: boolean;
    returnIdsOnly: boolean;
    returnCountOnly: boolean;
    returnExtentOnly: boolean;
    orderByFields: boolean;
    outStatistics: StatisticDefinition[];
    returnZ: boolean;
    returnM: boolean;
    multipatchOption: string;
    resultRecordCount: number;
    quantizationParameters: QuantizationParameter;
    returnCentroid: boolean;
};