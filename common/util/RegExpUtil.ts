export class RegExpUtil {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    // public static UUID = `[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}`;

    public static DATE_TIME = `[0-9]{14}`;
    public static DESCRIPTION = /(.*?)/;
    public static TRANSACTION_HASH = `[0-9a-fA-F]{64}`;
}
