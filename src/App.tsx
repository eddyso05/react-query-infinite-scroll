import "./App.css";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";

// @desc fetch Products from dummy json
const fetchProducts = async ({ pageParam = 0 }) => {
  const data = await (
    await fetch(`https://dummyjson.com/products?limit=10&skip=${pageParam}`)
  ).json();
  return data;
};

function App() {
  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
    ["products"],
    fetchProducts,
    {
      // getNextPageParam determining if there is more data to load and the information to fetch it.
      getNextPageParam: (lastPage, pages) => {
        // need to check if current page have more than totalPage or current skip have more than total products
        if (parseInt(lastPage.skip) < lastPage.total) {
          return parseInt(lastPage.skip) + lastPage.limit;
        }
        return false;
      },
    }
  );

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error</p>
  ) : (
    <div className="App">
      <InfiniteScroll
        hasMore={hasNextPage || false}
        next={fetchNextPage}
        // current page / length of the products array
        // it become a bit messy because that api is using skip instead of page
        dataLength={
          (data?.pages[data?.pages.length - 1].skip / data?.pages[0].limit) *
          data?.pages[0].limit
        }
        loader={<IndeterminateProgress />}
        endMessage={<EndMessage />}
      >
        {/* first loop is for check how many pages have */}
        {data?.pages.map((pages: any) => {
          // second loop is loop the products
          return pages?.products.map((post: any, index: number) => {
            return (
              <>
                <div
                  style={{ padding: "20px", border: "1px solid black" }}
                  key={index}
                >
                  <h5>{post.title}</h5>
                  <div>
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                </div>
              </>
            );
          });
        })}
      </InfiniteScroll>
    </div>
  );
}

// loading msg
function IndeterminateProgress() {
  return (
    <div className="css-1axwbpm h-2 ">
      <div className="css-n21wkn ">
        <div className="css-h5ends" style={{ width: "0%" }}></div>
      </div>
    </div>
  );
}

// When that is finish up the scroll
export function EndMessage() {
  return (
    <div className="px-4 py-3">
      <div className="flex flex-col items-center justify-center">
        <p className="font-medium ">You&apos;re All Caught Up ! </p>
      </div>
    </div>
  );
}

export default App;
