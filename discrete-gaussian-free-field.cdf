(* Content-type: application/vnd.wolfram.cdf.text *)

(*** Wolfram CDF File ***)
(* http://www.wolfram.com/cdf *)

(* CreatedBy='Mathematica 12.0' *)

(***************************************************************************)
(*                                                                         *)
(*                                                                         *)
(*  Under the Wolfram FreeCDF terms of use, this file and its content are  *)
(*  bound by the Creative Commons BY-SA Attribution-ShareAlike license.    *)
(*                                                                         *)
(*        For additional information concerning CDF licensing, see:        *)
(*                                                                         *)
(*         www.wolfram.com/cdf/adopting-cdf/licensing-options.html         *)
(*                                                                         *)
(*                                                                         *)
(***************************************************************************)

(*CacheID: 234*)
(* Internal cache information:
NotebookFileLineBreakTest
NotebookFileLineBreakTest
NotebookDataPosition[      1088,         20]
NotebookDataLength[      6794,        172]
NotebookOptionsPosition[      7302,        169]
NotebookOutlinePosition[      7640,        184]
CellTagsIndexPosition[      7597,        181]
WindowFrame->Normal*)

(* Beginning of Notebook Content *)
Notebook[{

Cell[CellGroupData[{
Cell[BoxData[
 RowBox[{"Manipulate", "[", 
  RowBox[{
   RowBox[{"Show", "[", 
    RowBox[{
     RowBox[{"ListPlot3D", "[", 
      RowBox[{
       RowBox[{"Re", "[", 
        RowBox[{"Fourier", "[", 
         RowBox[{"Table", "[", 
          RowBox[{
           RowBox[{
            RowBox[{"(", 
             RowBox[{
              RowBox[{"InverseErf", "[", 
               RowBox[{
                RowBox[{"2", " ", 
                 RowBox[{"Random", "[", "]"}]}], "-", "1"}], "]"}], "+", 
              RowBox[{"I", " ", 
               RowBox[{"InverseErf", "[", 
                RowBox[{
                 RowBox[{"2", " ", 
                  RowBox[{"Random", "[", "]"}]}], "-", "1"}], "]"}]}]}], 
             ")"}], "*", 
            RowBox[{"If", "[", 
             RowBox[{
              RowBox[{
               RowBox[{"j", "+", "k"}], "\[Equal]", "2"}], ",", "0", ",", 
              RowBox[{"1", "/", 
               RowBox[{"Sqrt", "[", 
                RowBox[{"(", 
                 RowBox[{
                  RowBox[{
                   RowBox[{"Sin", "[", 
                    RowBox[{
                    RowBox[{"(", 
                    RowBox[{"j", "-", "1"}], ")"}], "*", 
                    RowBox[{"Pi", "/", "m"}]}], "]"}], "^", "2"}], "+", 
                  RowBox[{
                   RowBox[{"Sin", "[", 
                    RowBox[{
                    RowBox[{"(", 
                    RowBox[{"k", "-", "1"}], ")"}], "*", 
                    RowBox[{"Pi", "/", "n"}]}], "]"}], "^", "2"}]}], ")"}], 
                "]"}]}]}], "]"}]}], ",", 
           RowBox[{"{", 
            RowBox[{"j", ",", "m"}], "}"}], ",", 
           RowBox[{"{", 
            RowBox[{"k", ",", "n"}], "}"}]}], "]"}], "]"}], "]"}], ",", 
       RowBox[{"ColorFunction", "->", "\"\<ValentineTones\>\""}], ",", 
       RowBox[{"LabelStyle", "\[Rule]", 
        RowBox[{"{", 
         RowBox[{
          RowBox[{"FontFamily", "\[Rule]", "\"\<CMU Serif\>\""}], ",", "11", 
          ",", 
          RowBox[{"GrayLevel", "[", "0", "]"}]}], "}"}]}]}], "]"}], ",", 
     RowBox[{"Boxed", "\[Rule]", "False"}], ",", 
     RowBox[{"ImageSize", "\[Rule]", "Large"}]}], "]"}], ",", 
   RowBox[{"{", 
    RowBox[{
     RowBox[{"{", 
      RowBox[{"m", ",", "100"}], "}"}], ",", "2", ",", "500"}], "}"}], ",", 
   RowBox[{"{", 
    RowBox[{
     RowBox[{"{", 
      RowBox[{"n", ",", "100"}], "}"}], ",", "2", ",", "500"}], "}"}]}], 
  "]"}]], "Input",
 CellChangeTimes->{{3.806419692530982*^9, 3.806419711617448*^9}, {
  3.806419753906505*^9, 3.8064197848843117`*^9}, {3.806419877216237*^9, 
  3.806419903085271*^9}, {3.806420054053171*^9, 3.8064201401610126`*^9}, {
  3.806420174349943*^9, 3.8064201859679947`*^9}, {3.806420221540501*^9, 
  3.806420224309081*^9}, {3.8064202856350193`*^9, 3.806420287247279*^9}, {
  3.806420543411624*^9, 3.806420548160433*^9}, {3.8065608503269176`*^9, 
  3.8065609223504467`*^9}, {3.806564727317418*^9, 3.8065647433607397`*^9}},
 CellLabel->
  "In[1302]:=",ExpressionUUID->"9233f4c1-966e-4a0d-90ba-208b63c52775"],

Cell[BoxData[
 TagBox[
  StyleBox[
   DynamicModuleBox[{$CellContext`m$$ = 100, $CellContext`n$$ = 100, 
    Typeset`show$$ = True, Typeset`bookmarkList$$ = {}, 
    Typeset`bookmarkMode$$ = "Menu", Typeset`animator$$, Typeset`animvar$$ = 
    1, Typeset`name$$ = "\"untitled\"", Typeset`specs$$ = {{{
       Hold[$CellContext`m$$], 100}, 2, 500}, {{
       Hold[$CellContext`n$$], 100}, 2, 500}}, Typeset`size$$ = {
    576., {235., 239.}}, Typeset`update$$ = 0, Typeset`initDone$$, 
    Typeset`skipInitDone$$ = True, $CellContext`m$5229221$$ = 
    0, $CellContext`n$5229222$$ = 0}, 
    DynamicBox[Manipulate`ManipulateBoxes[
     1, StandardForm, 
      "Variables" :> {$CellContext`m$$ = 100, $CellContext`n$$ = 100}, 
      "ControllerVariables" :> {
        Hold[$CellContext`m$$, $CellContext`m$5229221$$, 0], 
        Hold[$CellContext`n$$, $CellContext`n$5229222$$, 0]}, 
      "OtherVariables" :> {
       Typeset`show$$, Typeset`bookmarkList$$, Typeset`bookmarkMode$$, 
        Typeset`animator$$, Typeset`animvar$$, Typeset`name$$, 
        Typeset`specs$$, Typeset`size$$, Typeset`update$$, Typeset`initDone$$,
         Typeset`skipInitDone$$}, "Body" :> Show[
        ListPlot3D[
         Re[
          Fourier[
           
           Table[(InverseErf[2 Random[] - 1] + I InverseErf[2 Random[] - 1]) 
            If[$CellContext`j + $CellContext`k == 2, 0, 1/Sqrt[
              Sin[($CellContext`j - 1) (Pi/$CellContext`m$$)]^2 + 
               Sin[($CellContext`k - 1) (
                   Pi/$CellContext`n$$)]^2]], {$CellContext`j, \
$CellContext`m$$}, {$CellContext`k, $CellContext`n$$}]]], ColorFunction -> 
         "ValentineTones", LabelStyle -> {FontFamily -> "CMU Serif", 11, 
           GrayLevel[0]}], Boxed -> False, ImageSize -> Large], 
      "Specifications" :> {{{$CellContext`m$$, 100}, 2, 
         500}, {{$CellContext`n$$, 100}, 2, 500}}, "Options" :> {}, 
      "DefaultOptions" :> {}],
     ImageSizeCache->{621., {294., 300.}},
     SingleEvaluation->True],
    Deinitialization:>None,
    DynamicModuleValues:>{},
    SynchronousInitialization->True,
    UndoTrackedVariables:>{Typeset`show$$, Typeset`bookmarkMode$$},
    UnsavedVariables:>{Typeset`initDone$$},
    UntrackedVariables:>{Typeset`size$$}], "Manipulate",
   Deployed->True,
   StripOnInput->False],
  Manipulate`InterpretManipulate[1]]], "Output",
 CellChangeTimes->{{3.8064201178114567`*^9, 3.8064201440838337`*^9}, {
   3.806420183301941*^9, 3.806420189426209*^9}, 3.806420254182588*^9, 
   3.806420317615634*^9, 3.806420505014657*^9, 3.806420579665847*^9, {
   3.806560873103367*^9, 3.8065609227898493`*^9}, 3.806564744034547*^9},
 CellLabel->
  "Out[1302]=",ExpressionUUID->"ab705110-6b80-4ff8-bf87-a883538c178c"]
}, Open  ]]
},
WindowSize->{943, 755},
WindowMargins->{{Automatic, -113}, {Automatic, 0}},
FrontEndVersion->"12.0 for Mac OS X x86 (64-bit) (April 8, 2019)",
StyleDefinitions->"Default.nb"
]
(* End of Notebook Content *)

(* Internal cache information *)
(*CellTagsOutline
CellTagsIndex->{}
*)
(*CellTagsIndex
CellTagsIndex->{}
*)
(*NotebookFileOutline
Notebook[{
Cell[CellGroupData[{
Cell[1510, 35, 3047, 75, 178, "Input",ExpressionUUID->"9233f4c1-966e-4a0d-90ba-208b63c52775"],
Cell[4560, 112, 2726, 54, 613, "Output",ExpressionUUID->"ab705110-6b80-4ff8-bf87-a883538c178c"]
}, Open  ]]
}
]
*)

(* NotebookSignature QupCbn62hMFZOB1nBfUVT59R *)
