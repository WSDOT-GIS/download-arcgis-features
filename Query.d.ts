export declare type outputFormat = "json" | "geojson";
export declare type geometryType = "esriGeometryPoint" | "esriGeometryMultipoint" | "esriGeometryPolyline" | "esriGeometryPolygon" | "esriGeometryEnvelope";
export declare type spatialRel = "esriSpatialRelIntersects" | "esriSpatialRelContains" | "esriSpatialRelCrosses" | "esriSpatialRelEnvelopeIntersects" | "esriSpatialRelIndexIntersects" | "esriSpatialRelOverlaps" | "esriSpatialRelTouches" | "esriSpatialRelWithin";
export declare type units = "esriSRUnit_Meter" | "esriSRUnit_StatuteMile" | "esriSRUnit_Foot" | "esriSRUnit_Kilometer" | "esriSRUnit_NauticalMile" | "esriSRUnit_USNauticalMile";
export declare class StatisticDefinition {
    statisticType: "count" | "sum" | "min" | "max" | "avg" | "stddev" | "var";
    outStatisticField: string;
    outStatisticFieldName: string;
}
export declare class QuantizationParameter {
    extent: any;
    mode: string;
    originPosition: "upperLeft" | "lowerLeft";
    tolerance: number;
}
export default class Query {
    f: outputFormat;
    where: string;
    objectIds: number[];
    geometry: any;
    inSR: number;
    spatialRel: spatialRel;
    relationParam: string;
    time: Date;
    distance: number;
    units: units;
    outFields: string[] | "*";
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
}
