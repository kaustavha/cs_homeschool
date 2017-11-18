import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public enum GsonInstance {
    INSTANCE;

    public final Gson gson = new GsonBuilder().create();
}
