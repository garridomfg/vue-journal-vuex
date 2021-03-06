<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold">{{ day }}</span>
        <span class="mx-1 fs-3">{{ month }}</span>
        <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
      </div>

      <div>
        <input
          ref="imageSelector"
          type="file"
          @change="onSelectedImage"
          v-show="false"
          accept="image/png, image/jpeg"
        />
        <button
          v-if="entry.id"
          @click="onDeleteEntry"
          class="btn btn-danger mx-2"
        >
          Delete
          <i class="fa fa-trash-alt"></i>
        </button>
        <button @click="onSelectImage" class="btn btn-primary">
          Upload picture
          <i class="fa fa-upload"></i>
        </button>
      </div>
    </div>

    <hr />
    <div class="d-flex flex-column px-3 h-75">
      <textarea
        v-model="entry.text"
        placeholder="¿What´s happened today?"
      ></textarea>
    </div>

    <img
      v-if="entry.picture && !localImage"
      class="img-thumbnail"
      :src="entry.picture"
      alt="entry-picture"
    />
    <img
      v-if="localImage"
      class="img-thumbnail"
      :src="localImage"
      alt="entry-picture"
    />
  </template>

  <Fab icon="fa-save" @on:click="saveEntry" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import Swal from "sweetalert2";
import getDayMonthYear from "../helpers/getDayMonthYear";
import uploadImage from "../helpers/uploadImage";

export default {
  name: 'EntryView',
  components: {
    Fab: defineAsyncComponent(() => import("../components/Fab.vue")),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      entry: null,
      localImage: null,
      file: null,
    };
  },
  computed: {
    ...mapGetters("journal", ["getEntryById"]),
    day() {
      const { day } = getDayMonthYear(this.entry.date);
      return day;
    },
    month() {
      const { month } = getDayMonthYear(this.entry.date);
      return month;
    },
    yearDay() {
      const { yearDay } = getDayMonthYear(this.entry.date);
      return yearDay;
    },
  },
  methods: {
    ...mapActions("journal", ["updateEntry", "createEntry", "deleteEntry"]),
    loadEntry() {
      let entry;
      if (this.id === "new") {
        entry = {
          text: "",
          date: new Date().getTime(),
        };
      } else {
        entry = this.getEntryById(this.id);
        if (!entry) return this.$router.push({ name: "no-entry" });
      }
      this.entry = entry;
    },
    async saveEntry() {
      new Swal({
        title: "Please wait",
        allowOutsideClick: false,
      });

      Swal.showLoading();

      const picture = await uploadImage(this.file);
      this.entry.picture = picture;

      if (this.entry.id) {
        await this.updateEntry(this.entry);
      } else {
        const id = await this.createEntry(this.entry);
        this.$router.push({ name: "entry", params: { id } });
      }

      this.file = null;
      Swal.fire("Saved", "Entry successfully registered", "success");
    },
    async onDeleteEntry() {
      const { isConfirmed } = await Swal.fire({
        title: "¿Are you sure?",
        text: "Once deleted it cannot be recovered",
        showDenyButton: true,
        confirmButtonText: "Yes, i´m sure",
      });

      if (isConfirmed) {
        Swal.fire({
          title: "Please wait",
          allowOutsideClick: false,
        });
        Swal.showLoading();
        await this.deleteEntry(this.entry.id);
        this.$router.push({ name: "no-entry" });
        Swal.fire("Deleted", "", "success");
      }
    },
    onSelectedImage(event) {
      const file = event.target.files[0];

      if (!file) {
        this.localImage = null;
        this.file = null;
        return;
      }

      this.file = file;

      const fileReader = new FileReader();
      fileReader.onload = () => (this.localImage = fileReader.result);
      fileReader.readAsDataURL(file);
    },
    onSelectImage() {
      this.$refs.imageSelector.click();
    },
  },
  created() {
    this.loadEntry();
  },
  watch: {
    id() {
      this.loadEntry();
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  border: none;
  font-size: 20px;
  height: 100%;

  &:focus {
    outline: none;
  }
}
img {
  bottom: 150px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
  position: fixed;
  right: 20px;
  width: 200px;
}
</style>
