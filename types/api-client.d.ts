type MediaData = {
  id: string;
  type: string;
  fileName: string;
  extension: string;
};

type ClientResponse = Promise<{ status: number; ok: boolean; body: object }>;

/**
 * Api client
 *
 * @property {ContentTypeAPIClient<contenttypename>} contenttypename - api client for given content type
 * @property {function} contenttypename.get - get single content object, passing id as a argument.
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.list - list content objects, passing query params as a first argument
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.post - create content object, passing object as a argument
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.put - update content object, passing id and object as arguments
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.delete - delete content object, passing id as a argument
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.getContentType - get definition for given content type
 *     Will throw an error witout access to the content type.
 * @property {function} contenttypename.patch - partialy update content object, passing id and object as arguments
 *     Will throw an error witout access to the content type.
 */
declare class FlotiqApiClient {
  /**
   * List content types, passing query params as an argument.
   * Will throw an error witout access to the content type.
   *
   * @property {object} params - query params
   * @example {limit: 20, page: 2}
   */
  getContentTypes(params: object): ClientResponse;
  /**
   * Generate url for media. Use width/height params to generate url for resized image.
   * Will throw an error witout access to the _media content type.
   *
   * @property {object} mediaData - media data for which URL will be generated
   * @property {number} [height=0] height - desired height
   * @property {number} [width=0] width - desired width
   */
  getMediaUrl(mediaData: MediaData, height?: number, width?: number): string;

  [key: string]: {
    /**
     * Get single content object, passing id as a argument.
     * Will throw an error witout access to the content type.
     *
     * @property {string} id - content object ID
     */
    get(id: string): ClientResponse;
    /**
     * List content objects, passing query params as an argument.
     * Will throw an error witout access to the content type.
     *
     * @property {object} params - query params
     * @example {limit: 20, page: 2}
     */
    list(params: object): ClientResponse;
    /**
     * Create content object, passing object as an argument.
     * Will throw an error witout access to the content type.
     *
     * @property {object} object - creating object data
     */
    post(object: object): ClientResponse;
    /**
     * Update content object, passing id and object as arguments.
     * Will throw an error witout access to the content type.
     *
     * @property {string} id - content object ID
     * @property {object} object - new object data
     */
    put(id: string, object: object): ClientResponse;
    /**
     * Partialy update content object, passing id and object as arguments.
     * Will throw an error witout access to the content type.
     *
     * @property {string} id - content object ID
     * @property {object} object - object data to update
     */
    patch(id: string, object: object): ClientResponse;
    /**
     * Delete content object, passing id as an argument.
     * Will throw an error witout access to the content type.
     *
     * @property {string} id - content object ID
     */
    delete(id: string): ClientResponse;
    /**
     * Get definition for given content type.
     * Will throw an error witout access to the content type.
     */
    getContentType(): ClientResponse;
  };
}
