# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 75

[label main.go]
import (
	. . .
  [highlight]
	"github.com/rs/zerolog"
  [/highlight]
)

. . .
func searchHandler(w http.ResponseWriter, r *http.Request) error {
	u, err := url.Parse(r.URL.String())
	if err != nil {
		return err
	}

	params := u.Query()
	searchQuery := params.Get("q")
	pageNum := params.Get("page")
	if pageNum == "" {
		pageNum = "1"
	}

  [highlight]
	l := zerolog.Ctx(r.Context())

	l.UpdateContext(func(c zerolog.Context) zerolog.Context {
		return c.Str("search_query", searchQuery).Str("page_num", pageNum)
	})

	l.Info().
		Msgf("incoming search query '%s' on page '%s'", searchQuery, pageNum)
  [/highlight]

	nextPage, err := strconv.Atoi(pageNum)
	if err != nil {
		return err
	}

	pageSize := 20

	resultsOffset := (nextPage - 1) * pageSize

	searchResponse, err := searchWikipedia(searchQuery, pageSize, resultsOffset)
	if err != nil {
		return err
	}

  [highlight]
	l.Debug().Interface("wikipedia_search_response", searchResponse).Send()
  [/highlight]

	totalHits := searchResponse.Query.SearchInfo.TotalHits

	search := &Search{
		Query:      searchQuery,
		Results:    searchResponse,
		TotalPages: int(math.Ceil(float64(totalHits) / float64(pageSize))),
		NextPage:   nextPage + 1,
	}

	buf := &bytes.Buffer{}
	err = tpl.Execute(buf, search)
	if err != nil {
		return err
	}

	_, err = buf.WriteTo(w)
	if err != nil {
		return err
	}

  [highlight]
	l.Trace().Msgf("search query '%s' succeeded without errors", searchQuery)
  [/highlight]

	return nil
}