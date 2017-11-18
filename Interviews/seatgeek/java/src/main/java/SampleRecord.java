import com.google.gson.annotations.SerializedName;

public final class SampleRecord {

    public SampleInput input = new SampleInput();

    public SampleExpected expected = new SampleExpected();

    public SampleOutput output = new SampleOutput();

    public String toJson() {
        return GsonInstance.INSTANCE.gson.toJson(this);
    }

    public static final class SampleInput {

        @SerializedName("section")
        public String section;

        @SerializedName("row")
        public String row;
    }

    public static final class SampleExpected {

        @SerializedName("section_id")
        public int sectionId;

        @SerializedName("row_id")
        public int rowId;

        @SerializedName("valid")
        public boolean valid;
    }

    public static final class SampleOutput {

        @SerializedName("section_id")
        public int sectionId = -1;

        @SerializedName("row_id")
        public int rowId = -1;

        @SerializedName("valid")
        public boolean valid;
    }
}
