import React, { useEffect, useState } from "react";
import apiCall from "../service/apiCall";

export default function MainPage() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setperPage] = useState(10);
  const [sortBy, setSortBy] = useState("Relevance");
  const [accordionToggle, setAccordionToggle] = useState(false);
  useEffect(async () => {
    if (searchTerm) {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    } else {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
      )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }, [page, perPage]);

  function sortHelper() {
    if (sortBy === "Relevance") {
      return data;
    } else if (sortBy === "Likes: More-To-Less") {
      const tempData = [...data];
      tempData.sort((a, b) => b.user.total_likes - a.user.total_likes); //Desending
      return tempData;
    } else if (sortBy === "Likes: Less-To-More") {
      const tempData = [...data];
      tempData.sort((a, b) => a.user.total_likes - b.user.total_likes); //Ascending
      return tempData;
    } else if (sortBy === "Photos: More-To-Less") {
      const tempData = [...data];
      tempData.sort((a, b) => b.user.total_photos - a.user.total_photos); //Desending
      return tempData;
    } else if (sortBy === "Photos: Less-To-More") {
      const tempData = [...data];
      tempData.sort((a, b) => a.user.total_photos - b.user.total_photos); //Ascending
      return tempData;
    }
  }

  function onChangeHandler(e) {
    setSearchTerm(e.target.value);
  }

  async function blankSearchPageOne() {
    await apiCall(
      `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
    )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Error is ", error.data);
      });
  }

  async function onSearch() {
    if (searchTerm === "") {
      if (page > 1) {
        setData([]);
        setPage(1);
      } else blankSearchPageOne();
    } else {
      setData([]);
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "next") {
      setData([]);
      let currentPage = page;
      setPage((currentPage = currentPage + 1));
    } else if (name === "previous") {
      if (page <= 1) {
        alert("You are on the first page");
        setPage(1);
      } else {
        let currentPage = page;
        setPage((currentPage = currentPage - 1));
      }
    } else if (name === "accordion") {
      setAccordionToggle(value);
      if (accordionToggle === value) {
        setAccordionToggle(false);
      }
    } else {
      if (page > 1) setPage(1);
      else {
        onSearch();
      }
    }
  }

  function dropDownHelper(e, type) {
    e.preventDefault();
    const { value } = e.target.attributes;
    if (type === "per-page-dropdown") setperPage(value.nodeValue);
    else if (type === "sort-dropdown") setSortBy(value.nodeValue);
  }

  function options(dropdown) {
    if (dropdown === "per-page-dropdown") {
      const content = [5, 10, 20, 30];
      return content.map((item, index) => (
        <li key={index}>
          <a
            className={
              parseInt(perPage) === item
                ? "dropdown-item active"
                : "dropdown-item"
            }
            value={item}
            onClick={(e) => dropDownHelper(e, "per-page-dropdown")}
          >
            {item}
          </a>
        </li>
      ));
    } else if (dropdown === "sort-dropdown") {
      const content = [
        "Relevance",
        "Likes: More-To-Less",
        "Likes: Less-To-More",
        "Photos: More-To-Less",
        "Photos: Less-To-More",
      ];
      return content.map((item, index) => (
        <li key={index}>
          <a
            className={
              sortBy === item ? "dropdown-item active" : "dropdown-item"
            }
            value={item}
            onClick={(e) => dropDownHelper(e, "sort-dropdown")}
          >
            {item}
          </a>
        </li>
      ));
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="position-sticky top-0 bg-light mb-3 topbar-form"
      >
        <div className="row">
          <div className="col-sm-12 col-md-10">
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Search here..."
              onChange={onChangeHandler}
            />
          </div>
          <div className="col-sm-12 col-md-2">
            <button
              type="submit"
              className="btn btn-primary mb-3 search-button"
            >
              Search
            </button>
          </div>
        </div>
        <div className="row">
          <div className="dropdown col-6 col-sm-6 col-md-6 col-lg-6 per-page-dropdown">
            <label className="form-label me-2">Images per page:</label>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {perPage}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {options("per-page-dropdown")}
            </ul>
          </div>
          <div className="dropdown col-6 col-sm-6 col-md-6 col-lg-6 sort-dropdown">
            <div className="sort-dropdown-inner-div">
              <label className="form-label me-2">Sort By:</label>
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {sortBy}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                {options("sort-dropdown")}
              </ul>
            </div>
          </div>
        </div>
      </form>
      <div className="row">
        {sortHelper().length > 0 ? (
          sortHelper().map((item) => (
            <div key={item.id} className="col-sm-12 col-md-4 img-column">
              <img
                className="img-fluid img-class w-100"
                alt={item.alt_description}
                src={item.urls.small}
              />
              <div className="download-button-div">
                <a
                  href={`https://unsplash.com/photos/${item.id}/download?force=true`}
                  className="btn btn-outline-dark download-button"
                >
                  Download
                </a>
              </div>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button accordion-button-arrow"
                      type="button"
                      // aria-expanded={accordionToggle === item.id ? true : false}
                      value={item.id}
                      name="accordion"
                      onClick={onSubmitHandler}
                    >
                      {item.user.name ? item.user.name : "User Info"}
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className={
                      accordionToggle === item.id
                        ? "accordion-collapse collapse show"
                        : "accordion-collapse collapse"
                    }
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {item.user.bio && (
                        <div>
                          <strong>Bio: </strong>
                          <span className="text-break">{item.user.bio}</span>
                        </div>
                      )}
                      {item.user.total_likes.toString() && (
                        <div>
                          <strong>Total Likes: </strong>
                          {item.user.total_likes}
                        </div>
                      )}
                      {item.user.total_photos.toString() && (
                        <div>
                          <strong>Total Photos: </strong>
                          {item.user.total_photos}
                        </div>
                      )}
                      {(item.user.location ||
                        item.user.instagram_username ||
                        item.user.twitter_username) && <hr />}
                      {(item.user.location ||
                        item.user.instagram_username ||
                        item.user.twitter_username) && (
                        <div className="social-network-profiles">
                          {item.user.location && (
                            <div>
                              <strong>Location: </strong>
                              <span className="text-break">
                                {item.user.location}
                              </span>
                            </div>
                          )}
                          {item.user.instagram_username && (
                            <div>
                              <strong>Instagram: </strong>
                              <span className="text-break">
                                {item.user.instagram_username}
                              </span>
                            </div>
                          )}
                          {item.user.twitter_username && (
                            <div>
                              <strong>Twitter: </strong>
                              <span className="text-break">
                                {item.user.twitter_username}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="navigation-button d-flex justify-content-between">
        <div>
          <button
            onClick={onSubmitHandler}
            name="previous"
            className="btn btn-outline-primary"
          >
            Previous
          </button>
        </div>
        <div className="justify-content-center">{page}</div>
        <div>
          <button
            onClick={onSubmitHandler}
            name="next"
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
